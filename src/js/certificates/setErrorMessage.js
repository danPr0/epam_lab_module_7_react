export default function setErrorMessage(message) {
    document.getElementById('error').classList.remove('d-none')
    document.getElementById('errorMessage').textContent = message

    const timeout = setTimeout(() => document.getElementById('error').classList.add('d-none'), 10 * 1000)
    document.getElementById('errorCloseIcon').onclick = () => {
        document.getElementById('error').classList.add('d-none')
        clearTimeout(timeout)
    }
}
