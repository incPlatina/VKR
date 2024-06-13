using Data.Repositories;
using Domain.Entities;
using Domain.Requests;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL.Services
{
    public class FormuleService : IFormuleService
    {
        private readonly IBaseRepository<Formule> _formuleRepository;

        public FormuleService(IBaseRepository<Formule> formuleRepository)
        {
            _formuleRepository = formuleRepository;
        }

        public async Task<Formule> GetElementById(int id)
        {
            return await _formuleRepository.GetByIdAsync(id);
        }

        public async Task<List<Formule>> GetAllElements()
        {
            return await _formuleRepository.GetAllAsync();
        }

        public async Task CreateElement(FormuleModel elem)
        {
            Formule elem1 = new Formule
            {
                Name = elem.Name,
                FormuleText = elem.FormuleText,
                Element1 = elem.Element1,
                Element2 = elem.Element2,
                Description =elem.Description
            };
            await _formuleRepository.AddAsync(elem1);
        }

        public async Task UpdateElement(int id, FormuleModel elem)
        {
            Formule elem1 = new Formule
            {
                Name = elem.Name,
                FormuleText = elem.FormuleText,
                Element1 = elem.Element1,
                Element2 = elem.Element2,
                Description = elem.Description
            };
            await _formuleRepository.UpdateAsync(elem1);
        }

        public async Task DeleteElement(int id)
        {
            var elem = await _formuleRepository.GetByIdAsync(id);
            if (elem != null)
            {
                await _formuleRepository.DeleteAsync(elem);
            }
        }
    }
    public interface IFormuleService
    {
        Task<Formule> GetElementById(int id);
        Task<List<Formule>> GetAllElements();
        Task CreateElement(FormuleModel model);
        Task UpdateElement(int id, FormuleModel model);
        Task DeleteElement(int id);
    }

}
