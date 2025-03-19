import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async(req: Request, res: Response) => {
  // TODO: GET weather data from city name
 

  // TODO: save city to search history
  try {
    const city = req.body.cityName;
    const weatherData = await WeatherService.getWeatherForCity(city);
    await HistoryService.addCity(city);
    res.status(200).send(weatherData);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error saving city to search history' });
  }
  
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities();
    res.status(200).send(cities);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error getting search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await HistoryService.removeCity(id);
    res.status(200).send({ message: 'City removed from search history' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error removing city from search history' });
  }
});

export default router;
