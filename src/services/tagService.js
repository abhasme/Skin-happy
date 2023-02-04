import { DataService } from './dataService';

export const tagService = {
    get_tags: async (data) => {
        return DataService.get('/get_tags', data)
    },
    update_tag: async (data) => {
        return DataService.post('/update_tag', data)
    },
    add_tag: async (data) => {
        return DataService.post('/add_tag', data)
    },
    delete_tag: async (data) => {
        return DataService.get('/delete_tag', data)
    },
}

export default tagService;