import React from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import {
  useTransactions,
  useTransactionsDispatch,
  ActionType,
  Selected
} from "../providers/transactions";
import { useBlocks } from "../providers/blocks";

function TransactionModal() {
  const { selected } = useTransactions();
  const dispatch = useTransactionsDispatch();
  const onClose = () => dispatch({ type: ActionType.Deselect });
  const show = !!selected;

  const renderContent = () => {
    if (!selected) return null;
    return (
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-card card">
            <div className="card-header">
              <h4 className="card-header-title">Transaction Details</h4>

              <button type="button" className="close" onClick={onClose}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <table className="table table-sm table-nowrap">
              <thead>
                <tr>
                  <th className="text-muted">From</th>
                  <th className="text-muted">To</th>
                  <th className="text-muted">Amount (SOL)</th>
                </tr>
              </thead>

              <tbody className="list">
                <TransactionDetails selected={selected} />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`modal fade${show ? " show" : ""}`} onClick={onClose}>
      {renderContent()}
    </div>
  );
}

function TransactionDetails({ selected }: { selected: Selected }) {
  const { blocks } = useBlocks();
  const block = blocks[selected.slot];
  if (!block)
    return <span className="text-info">{"Transaction block not found"}</span>;

  if (!block.transactions) {
    return (
      <span className="text-info">
        <span className="spinner-grow spinner-grow-sm text-warning mr-2"></span>
        Loading
      </span>
    );
  }

  const details = block.transactions[selected.signature];
  if (!details)
    return <span className="text-info">{"Transaction not found"}</span>;

  if (details.transfers.length === 0)
    return <span className="text-info">{"No transfers"}</span>;

  let i = 0;
  return (
    <>
      {details.transfers.map(transfer => {
        return (
          <tr key={++i}>
            <td className="col-auto">
              <code>{transfer.fromPubkey.toBase58()}</code>
            </td>
            <td className="col ml-n2">
              <code>{transfer.toPubkey.toBase58()}</code>
            </td>
            <td className="col ml-n2">
              {`◎${(1.0 * transfer.lamports) / LAMPORTS_PER_SOL}`}
            </td>
          </tr>
        );
      })}
    </>
  );
}

export default TransactionModal;
