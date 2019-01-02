import { Rest } from 'src/utils/rest/rest';

export default (request, onError) => {
  return Rest.Instance.execute({
    ...request,
    onError: (response, showErrorUI) => {
      if(typeof onError === 'function') {
        return onError(response, showErrorUI);
      }
    },
  })
}