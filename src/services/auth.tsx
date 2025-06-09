import supabase from "@/commun/supabase";

const signInWithOAuth = async (provider : 'google' | 'facebook') => {
    await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
            redirectTo: `${window.location.origin}/home`
        }
    })
}

const getCurrentUser = async () => {
    const { data, error } = await supabase.auth.getSession()
    if (error) {
        console.error("Error fetching session:", error);
        return null;
    }
    return data.session?.user;
}

const getAccessToken = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
        console.error("Error fetching session:", error);
        return null;
    }
    return data.session?.access_token;
}

const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error("Error signing out:", error);
        throw error;
    }
    window.location.href = '/auth';
}
 
export { signInWithOAuth, getCurrentUser, getAccessToken, logout };