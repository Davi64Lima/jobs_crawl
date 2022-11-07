/**
 * Imports de todas as apis, styles ou funcionalidades das libs que são usadas no projeto (ou pelo menos nessa tela)
 */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { fetchEmail, fetchJobs } from "../../services/resources/jobs";
import RangeSlider from "react-range-slider-input";
import "./styles/cards.css";
import "./styles/flex.css";
import "./styles/footer.css";
import "./styles/forms.css";
import "./styles/globals.css";
import "./styles/sizes.css";
import "./styles/styles.css";
import "./styles/texts.css";
import "react-range-slider-input/dist/style.css";

const Home = () => {
  /**
   * States
   */


  /**
   * Cada state desses é capaz de armazenar um valor unico 
   * é composto por uma variavel e uma funçao desestruturadas dentro do array no inicio e um valor inicial para o state
   * A funçao é responsavel por atribuir um novo valor a variavel e a variavel é utilizada para
   * displays na tela ou criaçao de condiçoes em geral
   * 
   * e.g => const [variavel, função] = useState(valor inicial da variavel)
   */

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState("");
  const [sliderValue, setSlidervalue] = useState(0);

  /**
   * Memos
   */

  /**
   * useMemos sao responsaveis por computarem algum tipo de informação e retornar o valor computado
   * 
   * entretanto, o diferencial dos memos no react em geral é que ele consegue armazenar o valor computado
   * na memoria interna do proprio react, para que quando o usuário renderize a tela novamente, o valor computado
   * ja esteja disponivel para uso e aumente a performance da aplicação evitando rerenderers desnecessários.
   * 
   * useMemo é constituido por seu nome, uma callbackFunction que computa a logica que vc atribuir e um
   * array de dependencias que funciona como um observer responsavel por recomputar a logica, caso haja alguma mudança em
   * qualquer um dos elementos dentro do array
   * 
   * e.g: const nomeDoMemo = useMemo(callbackFunction, array de dependencias)
   * 
   * o memo so recomputa o valor novamente caso haja alguma mudança em qualquer uma das variaveis dispostas 
   * no seu array de dependencias
   */

  const availableJobs = useMemo(() => {
    if (!data && !filteredList) return []; // validaçoes para evitar variaveis indefinidas
    if (!filteredList) return data.map((e) => e.id); // caso n haja valores no filteredList, colocar todos os ids disponiveis no array
    return filteredList.map((e) => e.id); // colocar os ids filtrados pelo usuarios dentro de um array
  }, [filteredList, data]);

  const getSalary = useMemo(() => {
    if (!data) return 0; // validaçoes para evitar retornos indefinidos
    const salary = data.map((e) => e.salary).sort((a, b) => a - b); // juntando todos os salarios em um array e organizando-os de forma ascendente
    return salary[salary.length - 1]; // retornando o ultimo elemento do array de salarios que teoricamente é o maior disponivel
  }, [data]);

  /**
   * Callbacks
   */


  
  const formatSalary = (salary) => {
    return salary.toLocaleString("pt-br", // linguagem da string local 
     {
      style: "currency", // estilo de moeda
      currency: "BRL",  // codigo da moeda do pais
    });
  };
  
  /**
   * useCallbacks funcionam levemente semelhante com os memos, pois, alem de possuirem a capacidade de armazenar
   * valores em suas memorias internas para evitarem rerenderers desnecessarios, também possuem a mesma sintaxe.
   * 
   * Em geral, useCallbacks são otimos para requisiçoes http ou qualquer outra funcionalidade onde haja repetiçoes de requests
   * ou armazentamento de informaçao essencial em memoria para melhor performance
   */

  const handleGetEmail = useCallback(async () => {
    try {
       await fetchEmail({
        email,
        lista: availableJobs || [],
      });
      setEmail("");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [email, filteredList]);

  const handleGetData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchJobs({
        url: query,
      });
      setFilteredList(response);
      setData(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleListFilter = useCallback(() => {
    if (!data || !filteredList) return;
    if (sliderValue === 0) setFilteredList(data);
    setFilteredList(data.filter((e) => e.salary >= sliderValue));
  }, [sliderValue, data]);

  /**
   * Effects
   */

  /**
   * useEffect é um hook introduzido ao React como uma forma de substituir o jeito que lidamos com o ciclo de vida dos components
   * 
   * em geral, o useEffect é executado quando o componente é renderizado, quando alguma coisa do array de dependencias dele sofre
   * alguma alteração ou quando o componente é desmontado (caso desejado)
   * 
   * Possui a mesma sintaxe que useMemo e useCallback
   */

  useEffect(() => {
    handleListFilter();
  }, [handleListFilter]);

  return (
    <div className="align-center d-flex flex-column full-width justify-center">
      <div className="container full-width">
        <header className="full-width">
          <h1 className="text-center title title-size-1">Job Crawler</h1>
          <form className="d-flex form">
            <input
              type="text"
              className="input input-1 text-size-1"
              placeholder="Digite a url..."
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
            <div className="button-brand text-size-1" onClick={handleGetData}>
              Enviar
            </div>
          </form>
        </header>

        {filteredList.length ? (
          <div style={{ marginTop: 20, rowGap: 10 }}>
            {`de ${sliderValue} até ${getSalary}`}
            <div style={{ height: 10 }} />
            <RangeSlider
              value={sliderValue}
              max={getSalary}
              min={0}
              thumbsDisabled={[true,false]}
              onInput={(e) => setSlidervalue(e?.[1])}
              step={500}
            />
          </div>
        ) : null}

        <main className="card-container justify-center d-flex full-width">
          {loading ? (
            <h2 className="title title-size-2">carregando...</h2>
          ) : (
            filteredList.map((e, i) => (
              <article
                key={`vaga-${e.id}-in-${i}-list`}
                className="card card-content d-flex flex-column full-width"
              >
                <header>
                  <h2 className="title title-size-2">{e.jobName}</h2>
                  <ul className="card-content d-flex">
                    <li className="text-size-2">{e.company}</li>
                  </ul>
                </header>
                <main>
                  <p className="text text-size-1">{e.description}</p>
                </main>
                <footer className="card-content d-flex flex-column justify-between">
                  <ul className="align-center card-content d-flex">
                    {e.salary !== 0 && (
                      <li className="card-label fit-height text-size-2 text-center">
                        {formatSalary(e.salary)}
                      </li>
                    )}

                    {e.typeOfWork && (
                      <li className="card-label fit-height text-size-2 text-center">
                        {e.typeOfWork}
                      </li>
                    )}

                    <li className="card-label fit-height text-size-2 text-center">
                      {e.location}
                    </li>
                  </ul>
                  <a className="button-brand text-center" href={e.link}>
                    Acessar a vaga
                  </a>
                </footer>
              </article>
            ))
          )}
        </main>
      </div>
      <footer className="align-center d-flex flex-column footer full-width justify-center">
        <div className="align-center container d-flex flex-column full-width justify-center">
          <article className="footer-text">
            <h2 className="title title-size-2">Receber relatório no email?</h2>
            <p className="text text-size-1">
              Informe seu email e clique no botão abaixo caso queira receber um
              relatório das vagas buscadas no email.
            </p>
          </article>
          <form className="d-flex flex-column form full-width">
            <input
              type="email"
              className="full-height input input-2 text-size-1"
              placeholder="Digite seu melhor email..."
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <div
              className="button-brand full-height text-size-1"
              onClick={handleGetEmail}
            >
              Enviar
            </div>
          </form>
        </div>
      </footer>
    </div>
  );
};

export default Home;
