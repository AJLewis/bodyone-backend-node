import axios from 'axios';
import {IRecipeIngredient} from '../../models/Recipe.model';
import { IProductImageDocument } from '../../models/ProductImage.model';

export const generateRecipeImage = async (
    api: 'openai' | 'stable-diffusion',
    recipeName: string,
    productImageDoc:IProductImageDocument,
    ingredientsList?: IRecipeIngredient[]
) => {

    let ingredientNames: string[] = [];

    if(ingredientsList) {
        ingredientNames = ingredientsList.map((ingredient: any) => {
            return ingredient.ingredient.name;
        });
    }
   
    const request = { name: recipeName, prompt: `create a beautiful header image for ${recipeName} after it's cooked ${ingredientNames.length > 0 ? 'with the following ingredients:' : ''} ${ingredientNames.length > 0 ? ingredientNames.join( ', ') : ''} on tableware zoomed out. Hyperrealistic, highly detailed, cinematic lighting, stunningly beautiful, intricate, sharp focus, f/1. 8, 85mm, (centered image composition), (professionally color graded), ((bright soft diffused light)), volumetric fog, trending on instagram, trending on tumblr, HDR 8K`, };

    const maxRetries = 10;
    let delay = 4000; // Starting delay in milliseconds

    let response;

    if(api === 'openai') {
        response = await generateImageWithDallE(recipeName, maxRetries, request, delay, productImageDoc, ingredientsList);
    } else if(api === 'stable-diffusion') {
        response = await generateImageWithStableDiffusion(recipeName, maxRetries, request, delay, productImageDoc, ingredientsList);
    }

    return response;
};

const generateImageWithDallE = async (recipeName: string, maxRetries: number, request: any, delay: number, productImageDoc: IProductImageDocument, ingredientsList?: IRecipeIngredient[]) => {
    let response;

    for (let i = 0; i < maxRetries; i++) {
        try {
            response = await axios.post(
                `${process.env.API_BASE_HREF}${process.env.API_PRIVATE_LINK}/openai/image`,
                request,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.SHARED_SECRET}`,
                    },
                }
            );

            // Check if the response is in the desired state (e.g., processing is complete)
            if (response && response.data.response.data[0].url) {
                // Handle the response here
                break;
            }
        } catch (error) {
            console.error(error);
        }

        // If we've reached the max number of retries and the response is still not in the desired state, throw an error
        if (i === maxRetries - 1) {
            throw new Error('Maximum retry attempts reached: Attempts: ');
        }

        // Wait for the current delay period
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Double the delay for the next iteration
        delay *= 1.2;
    }

    if (response && response.data.response.data[0].url) {
        try {
            console.log(response?.data.response.data[0].url);
            productImageDoc.uri =
                response?.data.response.data[0].url.toString();
            productImageDoc.name = recipeName;
            productImageDoc.isPending = false;
            productImageDoc.model = 'openai';
            productImageDoc.save();
            return productImageDoc;
        } catch (err) {
            console.log(err);
        }
    } else {
        generateImageWithDallE(recipeName, maxRetries, request, delay, productImageDoc, ingredientsList);
        return;
    }
}

const generateImageWithStableDiffusion = async (recipeName: string, maxRetries: number, request: any, delay: number, productImageDoc: IProductImageDocument, ingredientsList?: IRecipeIngredient[]) => {
    let response;

    console.log('generateImageWithStableDiffusion: ' + recipeName)

    for (let i = 0; i < maxRetries; i++) {
        try {
            response = await axios.post(
                `${process.env.API_BASE_HREF}${process.env.API_PRIVATE_LINK}/stablediffusion/text_to_image`,
                request,
                {
                    headers: {
                        Authorization: `Bearer ${process.env.SHARED_SECRET}`,
                    },
                }
            );

            // Check if the response is in the desired state (e.g., processing is complete)
            if (response && response.data.status === 'success') {
                // Handle the response here
                break;
            }
        } catch (error) {
            console.error(error);
        }

        // If we've reached the max number of retries and the response is still not in the desired state, throw an error
        if (i === maxRetries - 1 && response?.data.status !== 'success') {
            throw new Error('Maximum retry attempts reached: Attempts: ');
        }

        // Wait for the current delay period
        await new Promise((resolve) => setTimeout(resolve, delay));

        // Double the delay for the next iteration
        delay *= 1.2;
    }

    if(response && response.data.status === 'success') {
        productImageDoc.uri = response?.data.image
        productImageDoc.name = recipeName;
        productImageDoc.isPending = false;
        productImageDoc.save();

        console.log('finished generateImageWithStableDiffusion: ' + recipeName)
    }
}
