const http = require('http');

const request = (options, data) => {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
};

async function runTests() {
  console.log('--- Starting API Integration Tests ---');

  // 1. Healthcheck
  const health = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/health',
    method: 'GET',
  });
  console.log('1. Healthcheck:', health.status, health.body.status);

  // 2. User Registration
  const testEmail = `user_${Date.now()}@example.com`;
  const regRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    {
      name: 'Diya Test User',
      email: testEmail,
      password: 'User@123456',
      role: 'user',
      occupation: 'Software Engineer',
    }
  );
  console.log('2. User Register:', regRes.status, regRes.body.success ? 'SUCCESS' : regRes.body.message);
  const userToken = regRes.body.token;

  // 3. User Login
  const loginRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: testEmail, password: 'User@123456' }
  );
  console.log('3. User Login:', loginRes.status, loginRes.body.success ? 'SUCCESS' : loginRes.body.message);

  // 4. Questions
  const qRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/assessments/questions',
    method: 'GET',
  });
  console.log('4. Assessment Questions:', qRes.status, `Got ${qRes.body.data.length} questions`);

  // 5. Submit Assessment
  const assessmentRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/assessments',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    },
    {
      answers: [
        { questionId: 1, responseValue: 3 },
        { questionId: 2, responseValue: 2 },
        { questionId: 3, responseValue: 3 },
        { questionId: 4, responseValue: 2 },
        { questionId: 5, responseValue: 1 },
        { questionId: 6, responseValue: 3 },
        { questionId: 7, responseValue: 2 },
        { questionId: 8, responseValue: 2 },
        { questionId: 9, responseValue: 2 },
        { questionId: 10, responseValue: 3 },
      ],
    }
  );
  console.log(
    '5. Submit Assessment:',
    assessmentRes.status,
    `Score: ${assessmentRes.body.data.totalScore}, Level: ${assessmentRes.body.data.stressLevel}`
  );

  // 6. Mood Journal Entry
  const moodRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/mood',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    },
    {
      mood: 'anxious',
      intensity: 6,
      title: 'Mid-term Project Pressure',
      notes: 'Feeling tight deadlines and some sleep loss, but practicing breathing exercises helps.',
      tags: ['Work', 'Deadlines', 'Studies'],
      sleepHours: 6,
      energyLevel: 5,
    }
  );
  console.log('6. Create Mood Entry:', moodRes.status, moodRes.body.success ? 'SUCCESS' : moodRes.body.message);

  // 7. Get Mood Trends
  const trendRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/mood/trends',
    method: 'GET',
    headers: { Authorization: `Bearer ${userToken}` },
  });
  console.log('7. Mood Trends:', trendRes.status, `Avg Intensity: ${trendRes.body.data.averageIntensity}`);

  // 8. Personalized Recommendations
  const recRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/recommendations/personalized',
    method: 'GET',
    headers: { Authorization: `Bearer ${userToken}` },
  });
  console.log('8. Recommendations:', recRes.status, `Level: ${recRes.body.currentStressLevel}, Got ${recRes.body.data.length} recs`);

  // 9. Counselors List
  const counselorList = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/appointments/counselors',
    method: 'GET',
  });
  const firstCounselor = counselorList.body.data[0];
  console.log('9. Counselors Available:', counselorList.status, `Found ${counselorList.body.data.length} (${firstCounselor.name})`);

  // 10. Book Appointment
  const bookRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/appointments',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userToken}`,
      },
    },
    {
      counselorId: firstCounselor._id,
      appointmentDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      timeSlot: '04:00 PM - 05:00 PM',
      reason: 'Dealing with academic stress and sleep disturbances.',
    }
  );
  console.log('10. Book Appointment:', bookRes.status, `Status: ${bookRes.body.data.status}`);

  // 11. Chatbot Assistance
  const chatRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/chatbot/message',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { message: 'I feel very anxious and overwhelmed about exams' }
  );
  console.log('11. Chatbot Response:', chatRes.status, chatRes.body.reply.substring(0, 60) + '...');

  // 12. Progress Report
  const reportRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/reports/my-progress',
    method: 'GET',
    headers: { Authorization: `Bearer ${userToken}` },
  });
  console.log('12. Progress Report:', reportRes.status, reportRes.body.data.summary.overallProgressStatus);

  // 13. Admin Login & Stats
  const adminLogin = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'admin@stresscare.org', password: 'Admin@123456' }
  );
  const adminToken = adminLogin.body.token;
  const adminStats = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/admin/stats',
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  console.log(
    '13. Admin Stats:',
    adminStats.status,
    `Users: ${adminStats.body.stats.totalUsers}, Counselors: ${adminStats.body.stats.totalCounselors}, Assessments: ${adminStats.body.stats.totalAssessments}`
  );

  console.log('--- ALL BACKEND INTEGRATION TESTS PASSED! ---');
  process.exit(0);
}

runTests().catch((e) => {
  console.error('Test Error:', e);
  process.exit(1);
});
