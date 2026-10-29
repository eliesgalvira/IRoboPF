import config from '../../eslint.config.mjs';
export default config.filter(c=>!(c.ignores && Object.keys(c).every(k=>k==='ignores'||k==='name')));
