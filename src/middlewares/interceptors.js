import { logger } from './logger';

const requestInterceptor = (req, res, next) => {
    //log requests
    logger.info(`${req.method} : ${JSON.stringify(req.query)}`);
    next();
}

export { requestInterceptor };