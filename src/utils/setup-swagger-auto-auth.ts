export function setupSwaggerAutoAuth(swaggerUI: any) {
  const origFetch = swaggerUI.fn.fetch;

  swaggerUI.fn.fetch = (req: any) => {
    // 🔹 Tangkap request login admin
    if (req.url.includes('/api/admin/login') && req.method === 'POST') {
      return origFetch(req).then((response: any) => {
        if (response.ok) {
          response
            .clone()
            .json()
            .then((data: any) => {
              const token = data?.access_token;
              const userId = data?.user_id;

              if (token) {
                const bearerValue = `Bearer ${token}`;

                // 🔹 Set otomatis token di Swagger Authorize
                swaggerUI.preauthorizeApiKey('access-token', bearerValue);

                // 🔹 Simpan user_id di localStorage
                if (userId) localStorage.setItem('swagger_user_id', userId);

                console.log('✅ Token & user_id tersimpan otomatis di Swagger');
              }
            });
        }
        return response;
      });
    }

    // 🔹 Tambahkan user_id ke setiap request berikutnya
    const storedUserId = localStorage.getItem('swagger_user_id');
    if (storedUserId) {
      req.headers['user_id'] = storedUserId;
    }

    return origFetch(req);
  };
}
