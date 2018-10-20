const axios = require('axios');
const Promise = require('bluebird');

const API_BASE = 'http://entertrain.127computerban.de/api';

const getCategories = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: API_BASE + '/categories',
    });

    return res.data['hydra:member'].map(cat => ({ id: cat['@id'], name: cat.name }));
  } catch (error) {
    console.error(error);
    return [];
  }
};

const transformCategories = (serverCategories = [], itemCategories = []) =>
  serverCategories.filter(cat => itemCategories.includes(cat.name)).map(cat => cat.id);

const sendToBackend = async items => {
  const categories = await getCategories();

  await Promise.map(items, async item => {
    const toServerItem = { ...item, categories: transformCategories(categories, item.categories) };

    try {
      const res = await axios({
        method: 'POST',
        url: API_BASE + '/videos',
        data: toServerItem,
      });

      console.log(res.status);
    } catch (error) {
      console.log(error.response.status, error.response.status === 400 ? error.response.data : undefined);
    }
  });
};

module.exports = { sendToBackend, getCategories };