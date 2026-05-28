function SendMSG() {
  var msg = document.getElementById("msginputbox");
  var header = document.getElementsByClassName("header")[0];
  let botmsg = "";

  const replies = {
    hi: "kkrh",
    hello: "Hello! How can I help you?",
    hey: "Hey there! What's up?",
    "how are you": "I'm doing great, thanks for asking!",
    "what's up": "Not much, just here to chat!",
    "good morning": "Good morning! Have a wonderful day!",
    "good night": "Good night! Sleep well!",
    bye: "Goodbye! Take care!",
    "thank you": "You're welcome!",
    thanks: "My pleasure!",
    ok: "Glad we're on the same page!",
    yes: "Awesome!",
    no: "Oh, okay. Let me know if you change your mind.",
    maybe: "I'll be here if you decide.",
    help: "Sure! What do you need help with?",
    info: "I'm a simple chat bot. Ask me anything!",
    "who are you": "I'm your friendly chat bot!",
    "what is your name": "You can call me ChatBot!",
    "how old are you": "I'm timeless 😊",
    "where are you from": "I live in the cloud!",
    "tell me a joke":
      "Why don't scientists trust atoms? Because they make up everything!",
    joke: "What do you call fake spaghetti? An impasta!",
    "love you": "Aww, love you too!",
    "i love you": "That's so sweet of you!",
    "you are smart": "Thanks! You're pretty awesome yourself.",
    "you are funny": "Glad I could make you smile!",
    "you are helpful": "That's my goal!",
    "what can you do": "I can chat, answer questions, and tell jokes!",
    "tell me a story":
      "Once upon a time, there was a curious user who loved chatting...",
    "sing a song": "La la la 🎵 I'm not a great singer though!",
    weather: "I can't check live weather, but I hope it's nice where you are!",
    news: "I don't have live news, but stay curious!",
    time: "Check your device clock — I don't have the time right now.",
    date: "Same as time — your device knows best!",
    "meaning of life": "42 😉",
    why: "Why not?",
    what: "What what?",
    huh: "Confused? Me too sometimes!",
    cool: "Right?!",
    nice: "Isn't it?",
    awesome: "You're awesome!",
    great: "Glad to hear that!",
    sad: "I'm sorry. Want to talk about it?",
    happy: "Yay! Keep smiling!",
    angry: "Take a deep breath. I'm here for you.",
    bored: "Let's play a word game! Say something.",
    tired: "Maybe take a short break?",
    hungry: "Go grab a snack!",
    thirsty: "Don't forget to drink water!",
    sleepy: "Get some rest, friend.",
    busy: "I'll wait — no rush!",
    "hello there": "General Kenobi! (Sorry, Star Wars joke 😄)",
    "hi there": "Hi! Ready to chat?",
    howdy: "Howdy partner! 🤠",
    greetings: "Greetings, human!",
    sup: "Not much, you?",
    yo: "Yo! What's good?",
    heya: "Heya! How's your day?",
    "hi bot": "Hello! Ask me anything.",
    "hey bot": "Hey! What's on your mind?",
    good: "That's great to hear!",
    bad: "Oh no. Hope things get better soon.",
    fine: "Glad you're fine!",
    "so so": "I see. Anything I can do?",
    amazing: "Love that energy!",
    wonderful: "You make it wonderful!",
    terrible: "I'm sorry. Want a joke to cheer up?",
    horrible: "Sending virtual hugs 🤗",
    excited: "Me too! Tell me more!",
    worried: "Everything will be okay. You're strong.",
    confused: "Take your time. I'll explain if I can.",
    lost: "I'm here to help you find your way.",
    lonely: "You're not alone — I'm always here to talk.",
    stressed: "Breathe in, breathe out. You've got this.",
    curious: "Curiosity is awesome! Ask away.",
    creative: "Nice! Create something amazing today.",
    lazy: "Same here sometimes 😅",
    productive: "That's the spirit!",
    weird: "Weird is wonderful!",
    shy: "No need to be shy with me!",
    brave: "I admire that!",
    kind: "So are you!",
    funny: "You made me laugh!",
    serious: "Okay, I'll be serious. What's up?",
    random: "Boo! Did I scare you? 😄",
    nothing: "Nothing? Even nothing is something.",
    everything: "Everything? That's a lot!",
    something: "Something is better than nothing!",
    idk: "No worries. We'll figure it out together.",
    "maybe later": "Take your time. I'll be here.",
    "not sure": "That's okay — thinking is good.",
    probably: "Probably is a fun word!",
    "never mind": "Okay, let me know if you change your mind.",
    wait: "I'm waiting... 🕒",
    hmm: "Thinking deep thoughts?",
    meh: "Eh, fair enough.",
    wow: "I know, right?!",
    omg: "Surprising, isn't it?",
    lol: "Glad you laughed!",
    rofl: "That's the spirit!",
    cry: "It's okay to cry. I'm here for you.",
    smile: "Keep smiling! It looks good on you.",
    facepalm: "*virtual facepalm* 😅",
    shrug: "*shrugs in binary*",
    "high five": "🖐️ High five back!",
    "fist bump": "👊 Boom!",
    hug: "🤗 Sending a big hug!",
    kiss: "😘 That's sweet, but let's keep it friendly!",
    secret: "I'll keep your secret safe 🤐",
    promise: "I promise to be a good bot!",
    deal: "Deal! 🤝",
    game: "Let's pretend we're playing chess. Your move!",
    play: "Rock paper scissors? I choose rock.",
    music: "What's your favorite song?",
    movie: "I love watching digital sunsets!",
    book: "Reading is awesome. What do you like?",
    food: "Now I'm hungry... 🍕",
    drink: "Coffee or tea?",
    pet: "Aww, pets are the best!",
    dog: "Woof! 🐕",
    cat: "Meow! 🐈",
    bird: "Tweet tweet! 🐦",
    fish: "Glub glub 🐠",
  };

  // Usage:
  if (replies[msg.value]) {
    botmsg = replies[msg.value];
  } else {
    botmsg = "That's interesting! Tell me more.";
  }


  if (msg.value == "") {
    alert("MSG");
  } else {
    
    header.innerHTML += `
     <div class="msg">
                <div class="mymsg">
                <img class="BotProfile" src="https://static.vecteezy.com/system/resources/previews/036/885/312/non_2x/blue-send-icon-free-png.png">\
                ${msg.value}</div>
                <br><br><br><br>
                <div class="Botmsg">
                    <img class="BotProfile" src="https://static.vecteezy.com/system/resources/previews/036/885/312/non_2x/blue-send-icon-free-png.png">
                    ${botmsg}
                </div>
            </div>

    `;
    msg.value=""
  }
}
