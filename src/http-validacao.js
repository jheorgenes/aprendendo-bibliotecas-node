
import chalk from "chalk";

function extraiLinks(arrLinks){
  //Object.values retorna uma lista de arrays com o valor do objeto passado como argumento (Cada valor em um array). O método join extrai os valores dentro dos arrays e junta tudo em um array só.
  return arrLinks.map((objetoLink)=> Object.values(objetoLink).join()); 
}

async function checaStatus(listaURLs){
  const arrStatus = await Promise.all(
    listaURLs.map(async (url)=> {
      try{
        const response = await fetch(url);
        return `${response.status} - ${response.statusText}`;
      }catch(erro){
        return manejaErros(erro);
      }
    })
  );
  return arrStatus;
}

function manejaErros(erro){
  if(erro.cause.code === 'ENOTFOUND'){
    return 'Link não encontrado';
  } else {
    return 'Ocorreu algum erro';
  }
}

export default async function listaValidada(listaDeLinks){
  const links = extraiLinks(listaDeLinks);
  const status = await checaStatus(links);

  return listaDeLinks.map((objeto, indice)=> ({
    ...objeto, //Spread operation (pega da lista cada elemento do objeto e retorna em sequência) ex.: [{1},{2},{3}] retorna [1,2,3]
    status: status[indice]
  }));
}
