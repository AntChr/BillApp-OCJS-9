/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { bills} from "../fixtures/bills.js"


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

    expect(document.querySelector(`[data-testid="form-new-bill"]`).onsubmit).toEqual(expect.any(Function));
    expect(document.querySelector(`input[data-testid="file"]`).onchange).toEqual(expect.any(Function));
  });
});

describe('handleChangeFile', () => {
  it('should handle file change event correctly', async () => {
    const onNavigate = jest.fn();

    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn()
    };

    const newBillInstance = new NewBill({
      document: document,
      onNavigate: onNavigate,
      store: {},
      localStorage: localStorageMock
    });

    localStorageMock.setItem('user', JSON.stringify({ email: 'test@example.com' }));

    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const fileList = [file];

    const storeMock = {
      bills: () => ({
        create: jest.fn().mockResolvedValueOnce({ fileUrl: 'testFileUrl', key: 'testKey' })
      })
    };

    newBillInstance.store = storeMock;

    const fileInput = document.createElement('input');
    fileInput.setAttribute('data-testid', 'file');
    Object.defineProperty(fileInput, 'files', {
      value: fileList.files
    });

    document.body.appendChild(fileInput);

    const event = new Event('change', { bubbles: true });
    fileInput.dispatchEvent(event);

    // Wait for the promise to resolve
    await Promise.resolve();

    expect(newBillInstance.fileUrl).toBe('testFileUrl');
    expect(newBillInstance.fileName).toBe('test.jpg');
  });
});

describe('handleSubmit', () => {
  it('should handle form submission event correctly', () => {
    const localStorageMock = {
      getItem: jest.fn().mockReturnValueOnce(JSON.stringify({ email: 'test@example.com' }))
    };
    const newBillInstance = new NewBill({ document: document, localStorage: localStorageMock });
  const form = document.querySelector('form[data-testid="form-new-bill"]');
  const event = new Event('submit', { bubbles: true });
  form.dispatchEvent(event);
  expect(alert).toHaveBeenCalledWith('Seuls les fichiers .jpg, .jpeg et .png sont autorisés.');
  });
  it('should handle form submission event correctly with valid data', () => {

    const localStorageMock = {
      getItem: jest.fn().mockReturnValueOnce(JSON.stringify({ email: 'test@example.com' }))
    };

    const updateBillMock = jest.fn();
    const onNavigateMock = jest.fn();

    const newBillInstance = new NewBill({ document: document, updateBill: updateBillMock, onNavigate: onNavigateMock, localStorage: localStorageMock });

    const form = document.querySelector('form[data-testid="form-new-bill"]');
    const event = new Event('submit', { bubbles: true });
    form.dispatchEvent(event);

    expect(updateBillMock).toHaveBeenCalledWith(expect.objectContaining({
      email: 'test@example.com',
    }));

    expect(onNavigateMock).toHaveBeenCalledWith(ROUTES_PATH['Bills']);
  });
});

describe('updateBill', () => {
  it('should update bill correctly', async () => {
    const onNavigate = jest.fn();
    const storeMock = {
      bills: () => ({
        update: jest.fn().mockResolvedValueOnce()
      })
    };

    const newBillInstance = new NewBill({
      document: document,
      onNavigate: onNavigate,
      store: storeMock,
      localStorage: {}
    });

    const mockBill = bills[0];
    newBillInstance.updateBill(mockBill);


    await Promise.resolve();

    expect(storeMock.bills().update).toHaveBeenCalledWith({ data: JSON.stringify(mockBill), selector: newBillInstance.billId });

    expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH['Bills']);
  });
});