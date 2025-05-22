import { Dropbox } from 'dropbox';

const dbx = new Dropbox({
    accessToken: 'sl.u.AFu5K88kxCeJKWvf5SChIfbPb5daMEqVMhkyPILG1Rqtk3Zw8g0sQ8LvnCUYXfk3wqJ6uXQJjtHOwsEGE1guLh9ssBJemkKjkZYFHapKALtLH2oUqH5A6TFbpc1MslR2EMTkDAQTc_0Z1gphMkv-oC_05Fp3EXe_6Ul7iikV8WrETpXDm74i9nXCGoGn0suBGeS1ad1RKd0oBLiIiG9T65LGzBXI4eu6da-H7csyHaUKZPw4S4nnLD7LiabkDUrqGkdSq2RiO3HKv-FCoQFVNxgqZGK5gqGrSaxnW2Gxjzx8Vi95JC2f23N0-ECAqbwrITt9pnVk0cmXwFkf4iqeLLBA-BPV_DDKzm2AA7qckFPR5asj9PHuFA_7rYRaqWE5UeWPGy6fiBsRZ22VettVJw-uiDn3OyjlFaWtjwUyioIJATQn225F6aYmgfn-8X_xE7w4-1coilWpZNdfZ_nj6rBH3NjA_2i2VY2KqSJ1peYpZa2NEjGvPtAgoWW9j51AMKrJL1eRDC2X_6SxHSmFbdynp7-9ud6dnAHMfKlPEBdPSoMjV4KST_2L92mpGfi1lgzJyTk73CgUEcfhoquZ_kJ7vfZnWVZCxn0HQEHO211D745vHpoDhafqVPDTdJqOy2vi2ERolnwhPsnMa3HsRPrA_UPo9IV5MFE8K8nwX0NsTk3B68-RWmv3jEq9p8Vazh36NfygKnmGVADSB6uuLwfaSi9IzxNGLLRLQOBI-KHbjqYasyRr-uaFNEkNWq_9u7HO8ItwjtDEVl4mWIZmy750ghUMZcFdjvfwkumGZcpntSG8RSu6ZM2wQxKkmUuTzM8IkLIFsnc1V_50RGS2cZhx4VRCAjnh3i7_P8mBguJYaGrVJxssTYQHJzHbjP4ZyyVogvAUInowsd75PLqgVrEppYt4OUzbgw-aM8z6sTudJl0iUTEAmQSbDji8k_ZpC8VJc3aODSVePKOATK8r3IrjxPaJ1EcEOB2QeskGbqZPGPRnDOa9mdUx78q02uwqwM-Ics57BWdf-_m1MF98XzvivttBPsv78pcIWa0DvtcjaLD9axfWWvTxTsSvZL6APDyLp13hvsWNq16idzP8gK_iCVZAicjX2Lvi1YUG9PE7pKtRdGxIux-vFCR05291jWaujejzRKpU5a46sdZ74AH8L4J8lvS9t2GWuau9pRnME18JDvPspshaUv3a2t-hr9P2S8pzl364IiOZvHVEPPPI6o_Ud9ku1wQ74hLZgHdE7_coTJsY5pw4mm34v0ESKNG5q4D3LXpP_mlteArSvlS3Jls2UvhkOv9tmP7hDmxyE8jQmuVvddIoAI8bzUqRwGSK3VJ40r25bxeyCJ2wNeMWTnJcoiptsb6MbJqA7QCKY7DO_RG6uZwg3vUqoNZlm-7pX0_sZjnctSSOgqKEBnwoeEHZJ5sHDZOE_jV450PuVg'
});

export const getDropboxImageUrl = async (path) => {
    try {
        // Удаляем начальный слеш, если он есть
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        
        // Получаем временную ссылку на файл
        const response = await dbx.filesGetTemporaryLink({ path: `/${cleanPath}` });
        return response.result.link;
    } catch (error) {
        console.error('Error getting Dropbox image URL:', error);
        return '/images/book-default.jpg'; // Возвращаем дефолтное изображение в случае ошибки
    }
};

// Функция для преобразования URL Dropbox в формат для API
export const convertDropboxUrlToPath = (url) => {
    try {
        // Пример URL: https://www.dropbox.com/scl/fi/xxxxx/image.jpg?dl=0
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        // Получаем имя файла из URL
        const fileName = pathParts[pathParts.length - 1];
        return fileName;
    } catch (error) {
        console.error('Error converting Dropbox URL:', error);
        return null;
    }
}; 