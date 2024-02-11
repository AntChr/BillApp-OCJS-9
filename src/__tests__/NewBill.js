/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
    })
  })
})
describe('NewBill', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form data-testid="form-new-bill">
        <input type="file" data-testid="file" />
      </form>
    `;
  });

  it('should initialize form elements and event listeners', () => {
    const newBillInstance = new NewBill({ document: document });

    expect(document.querySelector(`form[data-testid="form-new-bill"]`)).toBeDefined();
    expect(document.querySelector(`input[data-testid="file"]`)).toBeDefined();

    expect(document.querySelector(`form[data-testid="form-new-bill"]`).onsubmit).toEqual(expect.any(Function));
    expect(document.querySelector(`input[data-testid="file"]`).onchange).toEqual(expect.any(Function));
  });
});

describe('handleChangeFile', () => {
  it('should handle file change event correctly', () => {
    const newBillInstance = new NewBill({ document: document });

    const fileInput = document.querySelector(`input[data-testid="file"]`);
    fileInput.files = [new File(['fake-file-content'], 'fake-file.txt', { type: 'text/plain' })];
    fileInput.dispatchEvent(new Event('change'));

  });
});

describe('handleSubmit', () => {
  it('should handle form submission event correctly', () => {
    const newBillInstance = new NewBill({ document: document });

    const form = document.querySelector(`form[data-testid="form-new-bill"]`);
    form.dispatchEvent(new Event('submit'));

  });
});