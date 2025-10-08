import { GanhadorModel, LojaModel } from './schemas';

export async function seedDatabase() {
  try {
    console.log('📦 Populando banco de dados com dados de exemplo...');

    // Limpar dados existentes
    await GanhadorModel.deleteMany({});
    await LojaModel.deleteMany({});

    // Dados de exemplo para Ganhadores (conforme especificação do desafio)
    const ganhadores = [
      {
        nome: 'Maria Silva',
        estado: 'SP',
        cidade: 'São Paulo',
        premio: 'Smart TV 50 polegadas',
        data: new Date('2024-08-15')
      },
      {
        nome: 'João Santos',
        estado: 'RJ',
        cidade: 'Rio de Janeiro',
        premio: 'Smartphone Top de Linha',
        data: new Date('2024-08-16')
      },
      {
        nome: 'Ana Costa',
        estado: 'MG',
        cidade: 'Belo Horizonte',
        premio: 'Viagem para 2 pessoas',
        data: new Date('2024-08-17')
      },
      {
        nome: 'Pedro Almeida',
        estado: 'SP',
        cidade: 'Campinas',
        premio: 'Smart TV 50 polegadas',
        data: new Date('2024-08-18')
      },
      {
        nome: 'Carla Oliveira',
        estado: 'RJ',
        cidade: 'Niterói',
        premio: 'Notebook Gamer',
        data: new Date('2024-08-19')
      },
      {
        nome: 'Rafael Santos',
        estado: 'MG',
        cidade: 'Uberlândia',
        premio: 'Console de Video Game',
        data: new Date('2024-08-20')
      }
    ];

    // Dados de exemplo para Lojas (conforme especificação do desafio)
    const lojas = [
      {
        nome: 'Supermercado Bom Preço',
        cnpj: '12.345.678/0001-90',
        estado: 'SP',
        cidade: 'São Paulo',
        endereco: 'Rua das Flores, 123 - Centro',
        latitude: -23.5505,
        longitude: -46.6333
      },
      {
        nome: 'Hipermercado Economia',
        cnpj: '98.765.432/0001-10',
        estado: 'RJ',
        cidade: 'Niterói',
        endereco: 'Av. Principal, 456 - Boa Viagem',
        latitude: -22.8839,
        longitude: -43.1031
      },
      {
        nome: 'Mercado da Esquina',
        cnpj: '11.222.333/0001-44',
        estado: 'MG',
        cidade: 'Uberlândia',
        endereco: 'Praça da Liberdade, 789 - Bairro Novo',
        latitude: -18.9188,
        longitude: -48.2767
      },
      {
        nome: 'Supermercado Central',
        cnpj: '55.666.777/0001-88',
        estado: 'SP',
        cidade: 'Campinas',
        endereco: 'Rua Central, 321 - Centro',
        latitude: -22.9056,
        longitude: -47.0608
      },
      {
        nome: 'Mercado do Bairro',
        cnpj: '33.444.555/0001-22',
        estado: 'RJ',
        cidade: 'Rio de Janeiro',
        endereco: 'Av. Copacabana, 567 - Copacabana',
        latitude: -22.9068,
        longitude: -43.1729
      }
    ];

    // Inserir ganhadores
    const ganhadoresInseridos = await GanhadorModel.insertMany(ganhadores);
    console.log(`✅ ${ganhadoresInseridos.length} ganhadores inseridos`);

    // Inserir lojas
    const lojasInseridas = await LojaModel.insertMany(lojas);
    console.log(`✅ ${lojasInseridas.length} lojas inseridas`);

    console.log('🎉 Banco de dados populado com sucesso!');
    
    return {
      ganhadores: ganhadoresInseridos.length,
      lojas: lojasInseridas.length
    };
  } catch (error) {
    console.error('❌ Erro ao popular banco de dados:', error);
    throw error;
  }
}