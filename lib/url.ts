import qs from "query-string";

interface UrlQueryParams {
  params: string;
  key: string;
  value: string;
}

// todo: update url query parameter with a new value
export const urlQueryForm = ({ params, key, value }: UrlQueryParams) => {
  const queryString = qs.parse(params);

  // then update the value
  queryString[key] = value;

  return qs.stringifyUrl({
    url: window.location.pathname,
    query: queryString,
  });
};

interface RemoveUrlQueryParams {
  params: string;
  keysToRemove: string[];
}

export const removeKeysFromQuery = ({ params, keysToRemove }: RemoveUrlQueryParams) => {
  const queryString = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete queryString[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: queryString,
    },
    {
      skipNull: true,
    }
  );
};
