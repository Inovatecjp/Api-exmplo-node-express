  const axios = require('axios');
  export default async function validarCEP(cep) {


  
    // Remover caracteres não numéricos
    cep =   cep ? cep.replace(/\D+/g, '') : '';

  
    // Verificar se o CEP tem 8 dígitos
    if (cep.length !== 8) {
      return false;
    }
    
    const result = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
  
    if (result.status == 200 && (!result.data.erro)){
      return true;

    }
    // Formato válido
    return true;
  }
  
  


