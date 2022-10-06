import { render, screen } from '@testing-library/react'
import Products from './Products'
import Axios from 'axios'

jest.mock('axios')

test('renders correctly', async () => {
    Axios.get.mockImplementationOnce(request => {
        if (request.match(/configuration\/products$/i)) {
            return Promise.resolve({
            data: [
                {
                    productId: "ABC123",
                    productName: "Test Product 1"
                }
            ]})
        }
        else {
            return Promise.reject("incorrect request")
        }})
    render(<Products/>)
    const firstProductId = await screen.findByText(/ABC123/)
    expect(firstProductId).toBeDefined()
})