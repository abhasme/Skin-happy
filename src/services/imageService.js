import { DataService } from "./dataService";
export const imageService = {
  uploadImage: async (data) => {
    return DataService.post("/upload_photos", data);
  },
  get_new_uploads: async (data) => {
    return DataService.get("/get_new_uploads", data);
  },
  delete_new_uploads: async (data) => {
    return DataService.post("/delete_new_uploads", data);
  },
  get_details: async (data) => {
    return DataService.post("/get_details", data);
  },
  update_basic_details: async (data) => {
    return DataService.post("/update_basic_details", data);
  },

  update_Completed_details: async (data) => {
    return DataService.post("/update_Completed_details", data);
  },
  get_partially_uploads: async () => {
    return DataService.get("/get_partially_uploads");
  },
  update_details: async (data) => {
    return DataService.post("/update_details", data);
  },
  update_as_complete: async (data) => {
    return DataService.post("/update_as_complete", data);
  },
  get_complete: async (data) => {
    return DataService.get("/get_complete", data);
  },
  get_partially_uploads_filter: async (data) => {
    return DataService.get("/get_partially_uploads_filter", data);
  },
  get_complete_uploads_filter: async (data) => {
    return DataService.get("/get_complete_uploads_filter", data);
  },
  update_photos: async (data) => {
    return DataService.post("/update_photos", data);
  },
};

export default imageService;
