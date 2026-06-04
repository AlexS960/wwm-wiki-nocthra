export type NormalizedDomains = {
  guides: boolean;
  wiki: boolean;
  chat: boolean;
  comments: boolean;
  news: boolean;
  support: boolean;
  versions: boolean;
};

export function emptyNormalizedDomains(): NormalizedDomains {
  return {
    guides: false,
    wiki: false,
    chat: false,
    comments: false,
    news: false,
    support: false,
    versions: false,
  };
}
