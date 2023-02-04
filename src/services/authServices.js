import { DataService } from './dataService'
export const authServices = {
    login: async (data) => {
        return DataService.post('/login', data)
    },
}

export default authServices