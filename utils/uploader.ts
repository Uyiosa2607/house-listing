import {createClient} from "./supabase/server";

const supabase = createClient();

async function uploader(file) {
    try {
        const {error, data} = await supabase.storage
            .from("storage")
            .upload(`images/${file.name}`, file);

        if (!error) return data;

        return null;
    } catch (error) {
        console.log(error);
    }
}

export {uploader};
