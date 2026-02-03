using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerSide.Models;

namespace ServerSide.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly TransactionContext _context;

        public TransactionsController(TransactionContext context)
        {
            _context = context;
        }

        [HttpGet("GetCategoryList")]
        public async Task<ActionResult<List<Category>>> GetCategoryList()
        {
            try
            {
                var categories = await _context.Categories.ToListAsync();
                return Ok(categories);
            }catch(Exception ex)
            {
                string s = ex.Message;
                return BadRequest();
            }
        }

        [HttpGet("GetTransactionDetails")]
        public async Task<ActionResult<List<Transactions>>> GetTransactionDetails()
        {
             var transactions = await _context.Transactions
                .Include(t => t.Category)
                .ToListAsync();

            return Ok(transactions); 
        }

        [HttpPost("AddTransactionLine")]
        public async Task<ActionResult> AddTransactionLine([FromBody] Transactions newTransaction)
        {
            try
            {
                if (newTransaction == null)
                {
                    return BadRequest("Transaction data is null.");
                }
                newTransaction.CategoryId = newTransaction.Category?.Id;
                newTransaction.Category = null;
                _context.Transactions.Add(newTransaction);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Transaction saved successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error saving transaction: " + ex.Message });
            }
        }


    [HttpDelete("DeleteTransactionLine/{id}")]
        public async Task<ActionResult> DeleteTransactionLine(int id)
        {
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null)
            {
                return NotFound("Transaction not found.");
            }
            _context.Transactions.Remove(transaction);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Transaction deleted successfully." });
        }

        [HttpPut("UpdateTransactionLine/{id}")]
        public async Task<ActionResult> UpdateTransactionLine(int id, [FromBody] Transactions updatedTransaction)
        {
            if (updatedTransaction == null || id != updatedTransaction.Id)
            {
                return BadRequest("Transaction data is invalid.");
            }

            var existing = await _context.Transactions.FindAsync(id);
            if (existing == null)
            {
                return NotFound("Transaction not found.");
            }

            existing.Date = updatedTransaction.Date;
            existing.Amount = updatedTransaction.Amount;
            existing.Description = updatedTransaction.Description;
            existing.CategoryId = updatedTransaction.CategoryId;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Transaction updated successfully." });
        }
    }
    }
