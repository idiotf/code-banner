export function uploadFile() {
  const input = document.createElement('input')
  input.type = 'file'

  const { promise, resolve } = Promise.withResolvers<FileList | null>()
  input.addEventListener('change', () => resolve(input.files))
  input.click()
  return promise
}

let a: HTMLAnchorElement

export function downloadHref(href: string, download = '') {
  a ||= document.createElement('a')
  a.href = href
  a.download = download
  a.click()
}

export function downloadText(text: string, mime: string, download = '') {
  const bytes = Buffer.from(text, 'utf8')
  const base64 = bytes.toString('base64')
  downloadHref(`data:${mime};base64,${base64}`, download)
}
