export const initialState = 0;

export const reducer = (state, action) => {
  console.log("action.payload", action.payload);
  if (action.type === "USER") {
    return action.payload;
  }
  console.log("state", state);
  return state;
};
