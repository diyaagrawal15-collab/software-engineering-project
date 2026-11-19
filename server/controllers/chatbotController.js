// Knowledge base for stress management assistance
const RESPONSES = [
  {
    triggers: ['anxious', 'anxiety', 'panic', 'nervous', 'scared', 'freaking out'],
    reply:
      "I hear how overwhelming this feels right now. Let's ground ourselves together:\n\n1. Inhale deeply through your nose for 4 seconds.\n2. Hold your breath gently for 4 seconds.\n3. Exhale slowly through your mouth for 6 seconds.\n\nNotice 3 things you can see around you right now, and 2 textures you can touch. You are in a safe space.",
    suggestedActions: ['Start 4-7-8 Breathing', 'Log Mood in Journal', 'Crisis Helplines'],
  },
  {
    triggers: ['breathe', 'breathing', 'exercise', 'technique'],
    reply:
      "The 4-7-8 Breathing technique is scientifically proven to activate the parasympathetic nervous system (your body's relaxation switch):\n\n• Inhale quietly through your nose for 4 counts\n• Hold your breath for 7 counts\n• Exhale completely through your mouth making a gentle whoosh sound for 8 counts\n\nRepeat this cycle 4 times.",
    suggestedActions: ['Open Guided Breathing Tool', 'Take Stress Assessment'],
  },
  {
    triggers: ['sleep', 'insomnia', 'cant sleep', "can't sleep", 'tired', 'restless'],
    reply:
      "Sleep and stress are closely linked. Here are 3 gentle practices for tonight:\n\n1. Put your phone into night mode and keep screens away 30 minutes before sleep.\n2. Write down tomorrow's to-do items on paper to clear cognitive clutter from your mind.\n3. Try progressive muscle relaxation: tense and release your toes, calves, and shoulders sequentially.",
    suggestedActions: ['View Sleep Resources', 'Log Evening Journal'],
  },
  {
    triggers: ['work', 'burnout', 'overwhelmed', 'deadline', 'boss', 'job', 'exams', 'study'],
    reply:
      "Work and academic pressures can create significant cognitive overload. Remember:\n\n• Break massive tasks into 25-minute Pomodoro sprints.\n• It is completely okay to say 'I need to prioritize this carefully to deliver good quality.'\n• Take a mandatory 5-minute physical walk away from your desk every 90 minutes.",
    suggestedActions: ['Time Management Guide', 'Book Counselor Session'],
  },
  {
    triggers: ['depressed', 'sad', 'hopeless', 'crying', 'unhappy', 'lonely'],
    reply:
      "I am so sorry you are going through this heavy moment. Please know that your feelings are valid, and you do not have to carry this all alone.\n\nWhile I am an AI support guide and cannot provide clinical diagnosis or therapy, our platform connects you with qualified, compassionate counselors who are ready to support you.",
    suggestedActions: ['Book Counselor Session', 'View Crisis Helplines', 'Record in Journal'],
  },
  {
    triggers: ['suicide', 'kill myself', 'end my life', 'harm myself', 'emergency', 'crisis'],
    reply:
      "🚨 If you are experiencing overwhelming thoughts of self-harm or need urgent support, please know that immediate help is available right now. You are valuable, and people care about you.\n\nConfidential 24/7 National Helplines:\n• Tele-MANAS (Govt of India): 14416 or 1800-891-4416\n• KIRAN Mental Health Helpline: 1800-599-0019\n• Vandrevala Foundation: +91 9999 666 555\n• Emergency Police/Ambulance: 112\n\nPlease reach out to a professional or a loved one immediately.",
    suggestedActions: ['View Emergency Numbers', 'Call Tele-MANAS (14416)'],
  },
];

// @desc    Process chatbot message and return supportive response
// @route   POST /api/chatbot/message
// @access  Public or Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please send a valid message text',
      });
    }

    const cleanInput = message.toLowerCase().trim();

    // Check emergency triggers first
    const emergencyMatch = RESPONSES.find((r) =>
      r.triggers.some((t) => cleanInput.includes(t) && ['suicide', 'harm', 'kill myself'].includes(t))
    );

    if (emergencyMatch) {
      return res.status(200).json({
        success: true,
        reply: emergencyMatch.reply,
        suggestedActions: emergencyMatch.suggestedActions,
        isEmergency: true,
        disclaimer: 'Antigravity StressCare is an AI support assistant and does not provide clinical diagnosis or emergency medical care.',
      });
    }

    // Match intent
    let matchedResponse = null;
    for (const r of RESPONSES) {
      if (r.triggers.some((t) => cleanInput.includes(t))) {
        matchedResponse = r;
        break;
      }
    }

    if (!matchedResponse) {
      matchedResponse = {
        reply:
          "Thank you for sharing. Stress can manifest in many different forms—physically in muscle tension, emotionally in irritability, or mentally in feeling unable to focus.\n\nWould you like to try a 2-minute breathing exercise, evaluate your current stress level with our structured PSS-10 assessment, or browse our relaxation guides?",
        suggestedActions: ['Take Stress Assessment', 'Guided Breathing Exercise', 'Browse Resources'],
      };
    }

    res.status(200).json({
      success: true,
      reply: matchedResponse.reply,
      suggestedActions: matchedResponse.suggestedActions,
      isEmergency: false,
      disclaimer: 'StressCare Assistant is designed for educational guidance and self-care support, not medical or psychological diagnosis.',
    });
  } catch (error) {
    next(error);
  }
};
