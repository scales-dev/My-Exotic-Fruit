export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);

    const headers = new Headers(response.headers);

    if (/\.(ttf|otf)$/i.test(new URL(request.url).pathname)) {
      headers.set("Access-Control-Allow-Origin", "*");
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};