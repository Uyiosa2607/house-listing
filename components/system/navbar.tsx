"use client"
import {Button} from "@/components/ui/button"
import {useEffect} from "react";
import {useStore} from "@/utils/store"
import {createClient} from "@/utils/supabase/client"
import {useRouter} from "next/navigation"
import {LogOut} from "lucide-react"

export default function Navbar() {

    const router = useRouter()

    async function signOut() {
        try {
            const supabase = createClient()
            const {error} = await supabase.auth.signOut()
            if (!error) return router.push("/login")
        } catch (error) {
            console.log(error)
        }
    }

    const {userInfo, fetchUser} = useStore()

    useEffect(() => {
        fetchUser()
    }, []);

    return (
        <div className="px-2 py-3 flex justify-between items-center">
            <img className="w-10 h-10 rounded-full" alt={userInfo?.name}
                 src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/storage/${userInfo?.img}`}/>
            <Button variant="destructive" onClick={signOut}>
                Logout <LogOut className="ml-2" size={20}/>
            </Button>
        </div>
    )
}