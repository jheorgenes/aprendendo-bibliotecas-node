import chalk from 'chalk';
import fs from 'fs';
import pegaArquivo from "./index.js";
import listaValidada from './http-validacao.js';

const caminho = process.argv; //Retorna um array com o caminho absoluto do node e o caminho do arquivo que está sendo executado no momento

//No terminal do node, ao colocar: node cli.js  (deve-se passar o caminho do arquivo ou diretório na frente)

async function imprimeLista(valida, resultado, identificador = ''){
  if(valida){
    console.log(
      chalk.yellow('Lista validada'), 
      chalk.black.bgGreen(identificador),
      await listaValidada(resultado));
  } else {
    console.log(
      chalk.yellow('Lista de links: '), 
      chalk.black.bgGreen(identificador),
      resultado);
  }
}

async function processaTexto(argumentos){
  const caminho = argumentos[2];
  const valida = argumentos[3] === '--valida';


  try {
    fs.lstatSync(caminho);
  } catch (erro) {
    if(erro.code === 'ENOENT'){
      console.log('arquivo ou diretório não existe');
      return;
    }
  }

  if(fs.lstatSync(caminho).isFile()){ //Verifica se o caminho passado é de um arquivo
  const resultado = await pegaArquivo(argumentos[2]); //lê o arquivo e retorna os dados
  imprimeLista(valida, resultado);
  } else if(fs.lstatSync(caminho).isDirectory()){ //Se for um diretório
    const arquivos = await fs.promises.readdir(caminho); //Pega os arquivos que tiverem dentro do diretório
    arquivos.forEach(async (nomeDeArquivo)=>{ //Percorre a lista assíncrona de arquivos
      const lista = await pegaArquivo(`${caminho}/${nomeDeArquivo}`); //Pega o caminho e o nome do arquivo
      imprimeLista(valida, lista, nomeDeArquivo); //imprime a lista
    });
  }
}

processaTexto(caminho);