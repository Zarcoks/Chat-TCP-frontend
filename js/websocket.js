/**
 * Construction simplifiée du websocket
 * @param url
 * @param onopen
 * @param onclose
 * @param onmessage
 * @param onerror
 * @returns {WebSocket}
 */
export function getWebsocket(url, onopen, onclose, onmessage, onerror) {
    const ws = new WebSocket(url)
    ws.onopen = onopen
    ws.onclose = onclose
    ws.onmessage = onmessage
    ws.onerror = onerror
    return ws
}