import requests

API_KEY = "YOUR_ETHERSCAN_API_KEY"
BASE_URL = "https://api.etherscan.io/v2/api"

def query_etherscan(module: str, action: str, **kwargs) -> dict:
    """
    Base request function — the mixer board everything runs through.
    """
    params = {
        "chainid": 1,          # 1 = Ethereum mainnet
        "module": module,
        "action": action,
        "apikey": API_KEY,
        **kwargs,
    }

    response = requests.get(BASE_URL, params=params)
    response.raise_for_status()
    data = response.json()

    if data["status"] != "1":
        raise ValueError(f"API error: {data['message']} — {data.get('result')}")

    return data["result"]


# ── Example: Get ETH balance for a wallet ────────────────────────────
def get_eth_balance(address: str) -> str:
    result = query_etherscan(
        module="account",
        action="balance",
        address=address,
        tag="latest",
    )
    eth = int(result) / 1e18  # Convert Wei → ETH
    return f"{eth:.6f} ETH"


# ── Example: Get ERC-20 token transfers ──────────────────────────────
def get_token_transfers(address: str, contract: str = None) -> list:
    kwargs = {"address": address, "sort": "desc"}
    if contract:
        kwargs["contractaddress"] = contract

    return query_etherscan(
        module="account",
        action="tokentx",
        **kwargs,
    )


# ── Run ──────────────────────────────────────────────────────────────
if __name__ == "__main__":
    wallet = "0xYourWalletAddressHere"
    print(get_eth_balance(wallet))
