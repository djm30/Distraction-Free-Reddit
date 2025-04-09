export const dispatchUrlChangedEvent = (newUrl: string) => {
  const urlChangedEvent = new CustomEvent("urlChanged", {
    detail: { url: newUrl },
  });
  document.dispatchEvent(urlChangedEvent);
};
