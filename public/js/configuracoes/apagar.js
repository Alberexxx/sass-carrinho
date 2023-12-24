const processarImagem = async (imagem, tamanhoMaximoKB) => {
    if (!imagem) {
        return null;
    }

    const tamanhoMaximoBytes = tamanhoMaximoKB * 1024;
    const resolucaoAlvo = 800;

    try {
        let buffer;
        let qualidade = 100;

        console.log('Iniciando processamento de imagem...');

        buffer = await sharp(imagem.buffer)
            .resize({ width: resolucaoAlvo })
            .toFormat('jpeg', { quality: qualidade })
            .toBuffer();

        console.log('Imagem processada com qualidade inicial:', qualidade);

        // Iterativamente reduzir a qualidade até atender ao requisito de tamanho
        while ( buffer.length > tamanhoMaximoBytes && qualidade > 0) {
            qualidade -= 10;

            console.log('Reduzindo qualidade para:', qualidade);

            if (qualidade > 0) {
                // Evitar processamento adicional se a qualidade atingir zero
                buffer = await sharp(buffer)
                    .toFormat('jpeg', { quality: qualidade })
                    .toBuffer();
            }
        }

        console.log('Processamento de imagem concluído.');

        return buffer.length <= tamanhoMaximoBytes ? buffer : null;
    } catch (error) {
        console.error('Erro ao processar a imagem:', error);
        return null;
    }
};


// Uso da função processarImagem
const tamanhoMaximoKB = 100; // Ajuste conforme necessário
const fotoProcessadaPromise = processarImagem(foto, tamanhoMaximoKB);

// Esperar pela resolução das Promises antes de continuar
Promise.all([fotoProcessadaPromise])
    .then(([fotoProcessada]) => {
        if (fotoProcessada) {
            foto.buffer = fotoProcessada;
        }  
    })
    .catch((error) => {
        // Lidar com erros, se necessário
        console.error('Erro ao processar as imagens:', error);
    });

    upload.fields([{name: 'foto', maxCount: 1}])