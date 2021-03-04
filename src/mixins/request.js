import { HTTP } from '../axios';
const requestMixin = {
  methods: {
    getRequest(url, params = null) {
      const config = {
        params,
        headers: this.$store.getters.requestHeader
      };
      return HTTP.get(url, config);
    },
    deleteRequest(url, params = null) {
      const config = {
        params,
        headers: this.$store.getters.requestHeader
      };
      return HTTP.delete(url, config);
    },
    postRequest(url, data) {
      return HTTP.post(url, data,
        {
          headers: this.$store.getters.requestHeader
        }
      );
    }
  }
}

export default requestMixin;