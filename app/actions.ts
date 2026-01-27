'use server'

export async function sendSupportEmail(formData: FormData) {
    const name = formData.get('name')
    const email = formData.get('email')
    const message = formData.get('message')

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log('--- SUPPORT EMAIL RECEIVED ---')
    console.log(`From: ${name} (${email})`)
    console.log(`Message: ${message}`)
    console.log('------------------------------')

    return { success: true }
}
