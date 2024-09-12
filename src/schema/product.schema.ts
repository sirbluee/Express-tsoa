import * as yup from "yup";

export const productCreateSchema = yup.object({
    name: yup.string().required("Name must be provided"),
    price: yup.number().required("Price must greater than 0").positive(),
    category: yup.string().required("Category must be provided"),
  });

export default productCreateSchema;
