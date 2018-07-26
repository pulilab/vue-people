export const playDing = () => {
  try {
    const audio = new Audio('/ding.mp3');
    audio.play();
  } catch (e) {
    console.log(e);
  }
};
