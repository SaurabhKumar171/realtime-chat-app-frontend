export const getDateTime = () => {
  const now = new Date();
  const formatedDateTime = now.toLocaleString("en-US");
  return formatedDateTime;
};
