enum Emoji {
  MORNING = "☀️",
  NOON = "🌤️",
  NIGHT = "🌙",
}

const greet = (date?: Date): string => {
  const currentTime = date?.getHours() || new Date().getHours();
  let greetingText = "";

  if (currentTime < 12) {
    greetingText = "Good Morning";
  } else if (currentTime < 18) {
    greetingText = "Good Afternoon";
  } else {
    greetingText = "Good Evening";
  }

  return greetingText;
};

export const greetEmoji = (date?: Date): Emoji => {
  const currentTime = date?.getHours() || new Date().getHours();
  let greetingText = Emoji.MORNING;

  if (currentTime < 12) {
    greetingText = Emoji.MORNING;
  } else if (currentTime < 18) {
    greetingText = Emoji.NOON;
  } else {
    greetingText = Emoji.NIGHT;
  }

  return greetingText;
};

export default greet;
