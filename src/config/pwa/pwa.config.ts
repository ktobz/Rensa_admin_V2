export const useSetAppIsInstalled = () => {
  if (window.matchMedia("(display-mode: standalone)").matches) {
    console.log("display-mode is standalone");
    // if true .. hide the INSTALL BUTTON
  }

  window.addEventListener("appinstalled", (evt) => {
    console.log("a2hs installed");
  });
};
