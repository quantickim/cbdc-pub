const l=(r,o)=>{var s,i;const t=(i=(s=r.aliasNm)==null?void 0:s.trim())!=null?i:"",e=o==="primary"?r.priAliasNm===r.aliasNm:r.dfltAliasNm===r.aliasNm;return r.isWalletBlocked?3:e?0:t?1:2},n=(r,o={})=>{const{priority:t="default"}=o;return[...r].sort((e,a)=>{const s=l(e,t),i=l(a,t);return s-i})};export{n as s};
//# sourceMappingURL=sort-wallets-for-display-CKRK-xT4.js.map
