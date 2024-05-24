// User_SignUp.test.js
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { User_SignUp } from "./User_SignUp"; // Assuming User_SignUp component is exported as default from its file

test("submit button click triggers SubmitBtn function", () => {
  render(<User_SignUp />);

  fireEvent.change(screen.getByLabelText("Name"), {
    target: { value: "John Doe" },
  });
  fireEvent.change(screen.getByLabelText("Username"), {
    target: { value: "johndoe123" },
  });
  fireEvent.change(screen.getByLabelText("Email address"), {
    target: { value: "john@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Password"), {
    target: { value: "Test@123" },
  });
  fireEvent.change(screen.getByLabelText("Confirm Password"), {
    target: { value: "Test@123" },
  });

  
  fireEvent.click(screen.getByText("Submit"));

 
  expect(SubmitBtn).toHaveBeenCalled();
});
