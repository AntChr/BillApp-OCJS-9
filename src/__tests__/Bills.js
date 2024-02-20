/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom"
import userEvent from "@testing-library/user-event";
import BillsUI from "../views/BillsUI.js";
import Bills from '../containers/Bills.js';
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import store from "../__mocks__/store.js"

import router from "../app/Router.js";

let billsInstance

describe("Given I am connected as an employee", () => {

  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
    window.localStorage.setItem('user', JSON.stringify({
      type: 'Employee'
    }))
    const root = document.createElement("div")
    root.setAttribute("id", "root")
    document.body.append(root)
    router()
    window.onNavigate(ROUTES_PATH.Bills)
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
    }
    billsInstance = new Bills({
      document,
      onNavigate,
      store,
      localStorage: window.localStorage,
    })
  })

  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression

    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    it('should navigate to NewBill route when clicked', () => {
      const onNavigateMock = jest.fn();
      const billsInstance = new Bills({ document: document, onNavigate: onNavigateMock });

      billsInstance.handleClickNewBill();

      expect(onNavigateMock).toHaveBeenCalledWith(ROUTES_PATH['NewBill']);
    });

    it('should show modal with bill image when clicked', () => {

      const modale = document.getElementById("modaleFile")

      $.fn.modal = jest.fn(() => modale.classList.add("show"))

      const eye = screen.getAllByTestId("icon-eye")[0]

      const handleClickIconEye = jest.fn(billsInstance.handleClickIconEye(eye))

      eye.addEventListener('click', handleClickIconEye)

      userEvent.click(eye)

      expect(handleClickIconEye).toHaveBeenCalled()

      expect(modale.classList).toContain('show')
    });

    it('should return formatted bills from the store', async () => {
      const result = await billsInstance.getBills()
      expect(result.length).toBe(4)
    });

  })
})

