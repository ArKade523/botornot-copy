interface User {
    id: number
    username: string
    email: string
    profile_id: number
    password_hash: string
    Profile: Profile
    Schedule: Schedule[]
    Reptile: Reptile[]
    created_at: string
    updated_at: string
}

interface Profile {
    id: number
    first_name: string
    last_name: string
    user_id: number
    created_at: string
    updated_at: string
}
