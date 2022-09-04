import dotenv from 'dotenv';
import Cryptr from 'cryptr'
dotenv.config();

const ENCRYPTION_KEY  = process.env.ENCRYPTION_KEY || "key"

const cryptr = new Cryptr(ENCRYPTION_KEY)

 console.log(cryptr.decrypt("bfc0580438c60bb46b2f48bc72cdc39c81587be59d752da245971b4bc1107d62e4031a3f2e89f08ef779878338add745d97ff00f8616c1bd1b825cc7a55e7df1c8cfe0b2640a6db3481419a17b54304eaa583636a0c11c200a98e1cbc15eb18d92ee9b"))

    
    
     