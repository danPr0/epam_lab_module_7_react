export default function setSuccessMessage(message) {
    document.getElementById('success').classList.remove('d-none')
    document.getElementById('successMessage').textContent = message

    const timeout = setTimeout(() => document.getElementById('success').classList.add('d-none'), 3 * 1000)
    document.getElementById('successCloseIcon').onclick = () => {
        document.getElementById('success').classList.add('d-none')
        clearTimeout(timeout)
    }
}