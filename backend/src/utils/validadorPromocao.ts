import { TipoPromocao } from '../models/types';
import { IPromocaoDocument } from '../models/schemas';

export class ValidadorPromocao {
  
  static validarPeriodoPromocao(dataInicio: Date, dataFim: Date): { valido: boolean; erro?: string } {
    const agora = new Date();
    
    if (dataInicio >= dataFim) {
      return { valido: false, erro: 'Data de início deve ser anterior à data de fim' };
    }
    
    if (dataFim <= agora) {
      return { valido: false, erro: 'Data de fim deve ser futura' };
    }
    
    if (dataInicio < agora) {
      return { valido: false, erro: 'Data de início não pode ser no passado' };
    }
    
    return { valido: true };
  }
  
  static validarValorDesconto(tipo: TipoPromocao, valor: number): { valido: boolean; erro?: string } {
    switch (tipo) {
      case TipoPromocao.DESCONTO_PERCENTUAL:
        if (valor <= 0 || valor > 100) {
          return { valido: false, erro: 'Desconto percentual deve estar entre 0 e 100%' };
        }
        break;
        
      case TipoPromocao.DESCONTO_FIXO:
        if (valor <= 0) {
          return { valido: false, erro: 'Desconto fixo deve ser maior que zero' };
        }
        break;
        
      case TipoPromocao.FRETE_GRATIS:
        if (valor !== 0) {
          return { valido: false, erro: 'Frete grátis deve ter valor zero' };
        }
        break;
        
      default:
        return { valido: false, erro: 'Tipo de promoção não reconhecido' };
    }
    
    return { valido: true };
  }
  
  static validarLimiteUso(promocao: IPromocaoDocument): { valido: boolean; erro?: string } {
    if (promocao.limiteUso && promocao.usosAtuais >= promocao.limiteUso) {
      return { valido: false, erro: 'Limite de uso da promoção foi atingido' };
    }
    
    return { valido: true };
  }
  
  static promocaoAtiva(promocao: IPromocaoDocument): { valido: boolean; erro?: string } {
    if (!promocao.ativo) {
      return { valido: false, erro: 'Promoção está inativa' };
    }
    
    const agora = new Date();
    
    if (agora < promocao.dataInicio) {
      return { valido: false, erro: 'Promoção ainda não iniciou' };
    }
    
    if (agora > promocao.dataFim) {
      return { valido: false, erro: 'Promoção já expirou' };
    }
    
    const limiteValidacao = this.validarLimiteUso(promocao);
    if (!limiteValidacao.valido) {
      return limiteValidacao;
    }
    
    return { valido: true };
  }
  
  static validarCodigoPromocional(codigo: string): { valido: boolean; erro?: string } {
    if (codigo.length < 3 || codigo.length > 20) {
      return { valido: false, erro: 'Código promocional deve ter entre 3 e 20 caracteres' };
    }
    
    if (!/^[A-Z0-9]+$/.test(codigo)) {
      return { valido: false, erro: 'Código promocional deve conter apenas letras maiúsculas e números' };
    }
    
    return { valido: true };
  }
  
  static validarCompatibilidadePromocoes(promocoes: IPromocaoDocument[]): { valido: boolean; erro?: string } {
    // Exemplo: não permitir múltiplos descontos percentuais simultaneamente
    const descontosPercentuais = promocoes.filter(p => p.tipo === TipoPromocao.DESCONTO_PERCENTUAL);
    
    if (descontosPercentuais.length > 1) {
      return { valido: false, erro: 'Não é possível aplicar múltiplos descontos percentuais' };
    }
    
    // Verificar se a soma dos descontos percentuais não excede 100%
    const totalPercentual = descontosPercentuais.reduce((sum, p) => sum + p.valor, 0);
    if (totalPercentual > 100) {
      return { valido: false, erro: 'Desconto total não pode exceder 100%' };
    }
    
    return { valido: true };
  }
  
  static calcularDescontoMaximo(valorOriginal: number, promocoes: IPromocaoDocument[]): {
    valorFinal: number;
    descontoTotal: number;
    promocoesAplicadas: { promocaoId: string; desconto: number }[];
  } {
    let valorAtual = valorOriginal;
    let descontoTotal = 0;
    const promocoesAplicadas: { promocaoId: string; desconto: number }[] = [];
    
    // Aplicar descontos em ordem de prioridade (percentuais primeiro, depois fixos)
    const promocoesOrdenadas = [...promocoes].sort((a, b) => {
      const prioridade = {
        [TipoPromocao.DESCONTO_PERCENTUAL]: 1,
        [TipoPromocao.DESCONTO_FIXO]: 2,
        [TipoPromocao.FRETE_GRATIS]: 3,
        [TipoPromocao.LEVE_PAGUE]: 4
      };
      return prioridade[a.tipo] - prioridade[b.tipo];
    });
    
    for (const promocao of promocoesOrdenadas) {
      let desconto = 0;
      
      switch (promocao.tipo) {
        case TipoPromocao.DESCONTO_PERCENTUAL:
          desconto = (valorAtual * promocao.valor) / 100;
          break;
          
        case TipoPromocao.DESCONTO_FIXO:
          desconto = Math.min(promocao.valor, valorAtual);
          break;
          
        // Outros tipos podem ser implementados conforme necessário
      }
      
      if (desconto > 0) {
        valorAtual = Math.max(0, valorAtual - desconto);
        descontoTotal += desconto;
        promocoesAplicadas.push({
          promocaoId: (promocao as any)._id.toString(),
          desconto
        });
      }
    }
    
    return {
      valorFinal: valorAtual,
      descontoTotal,
      promocoesAplicadas
    };
  }
}