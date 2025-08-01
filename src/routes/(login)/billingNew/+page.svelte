<script>
    import { browser } from "$app/environment";
    import CancelPlan from "$lib/components/pages/billing/CancelPlan.svelte";
    import { apiurl } from "$lib/scripts/req";
    import { AlarmClock, ArrowDownUp, Clock, CurrencyIcon, PlusIcon, RefreshCcw, X } from "lucide-svelte";
    
    let email = "";
    let subscriptions = [];
    let loading = true;
    let error = null;
    
    if (browser) {
        email = localStorage.getItem("email");
        getSubscriptions();
        document.addEventListener("refresh", getSubscriptions)
    }
    
    function getSubscriptions() {
        loading = true;
        error = null;
        
        fetch(apiurl + "x/lapis/subs/" + email, {
            method: "GET",
            headers: {
                username: localStorage.getItem("accountEmail"),
                token: localStorage.getItem("token"),
            },
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error('Failed to fetch subscriptions');
            }
            return res.json();
        })
        .then((json) => {
            console.log(json);
            subscriptions = json;
            loading = false;
        })
        .catch((err) => {
            error = err.message;
            loading = false;
        });
    }
    
    function formatDate(timestamp) {
        return new Date(timestamp * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    function getStatusBadge(status) {
        const statusMap = {
            'active': 'badge-success',
            'canceled': 'badge-error',
            'past_due': 'badge-warning',
            'unpaid': 'badge-warning',
            'incomplete': 'badge-info'
        };
        return statusMap[status] || 'badge-neutral';
    }
    


    function getPlanName(productId) {
        if (productId == "prod_QmZfw9v9Y1lf8L") return "Premium Plan"
        if (productId == "prod_P9uYKnDHhdpfIi") return "Basic Plan"
        if (productId == "prod_P9uPHrP7gvFUEX") return "Plus Plan"
    }

function oneWeekBefore(unixTimestamp) {
  const twoWeeksInSeconds = 7 * 24 * 60 * 60; // 7 days
  return formatDate(unixTimestamp - twoWeeksInSeconds);
}
</script>

<div class="min-h-screen bg-base-200 py-8">
    <div class="container mx-auto px-4 max-w-4xl">
        <!-- Header -->
        <div class="mb-8">
            <h1 class="text-3xl font-bold text-base-content mb-2">Subscription Management</h1>
            <p class="text-base-content/70">Manage your active and past subscriptions</p>
        </div>

        <!-- Loading State -->
        {#if loading}
            <div class="flex justify-center items-center py-12">
                <span class="loading loading-spinner loading-lg"></span>
            </div>
        {/if}

        <!-- Error State -->
        {#if error}
            <div class="alert alert-error mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Error loading subscriptions: {error}</span>
                <div>
                    <button class="btn btn-sm btn-outline" on:click={getSubscriptions}>
                        Try Again
                    </button>
                </div>
            </div>
        {/if}

        <!-- Subscriptions List -->
        {#if !loading && !error}
            {#if subscriptions.length === 0}
                <div class="card bg-base-100 shadow-xl">
                    <div class="card-body text-center py-12">
                        <div class="text-6xl mb-4">📋</div>
                        <h2 class="card-title justify-center text-2xl mb-2">No Subscriptions Found</h2>
                        <p class="text-base-content/70">You don't have any subscriptions yet.</p>
                        <div class="card-actions justify-center mt-6">
                            <button class="btn btn-primary">Browse Plans</button>
                        </div>
                    </div>
                </div>
            {:else}
                <div class="space-y-4">
                    {#each subscriptions as subscription, index}
                        <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                            <div class="card-body">
                                <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                    <!-- Subscription Info -->
                                    <div class="flex-1">
                                        <div class="flex items-center gap-3 mb-3">
                                            <h2 class="card-title text-xl">
                                                Arth Hosting: {getPlanName(subscription.product_id)}
                                            </h2>
                                            <div class="badge {getStatusBadge(subscription.status)} badge-lg">
                                                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                                            </div>
                                        </div>
                                        
                                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div class="space-y-2">
                                                <div class="flex items-center gap-2 text-sm">
                                                    <CurrencyIcon size=16/>
                                                    <span class="text-base-content/70">Price:</span>
                                                   <span class="font-medium">{subscription.price}</span>
                                                </div>
                                                
                                                <div class="flex items-center gap-2 text-sm">
                                                  <Clock size=16/>
                                                    <span class="text-base-content/70">Started:</span>
                                                    <span class="font-medium">{formatDate(subscription.start_date)}</span>
                                                </div>
                                         
                                                <div class="flex items-center gap-2 text-sm">
                                                  <AlarmClock size=16/>
                                                    <span class="text-base-content/70">Current Period Ends:</span>
                                                    <span class="font-medium">{formatDate(subscription.current_period_end)}</span>
                                                </div>
                                                
                                                {#if subscription.status == 'canceled'}
                                                    <div class="flex items-center gap-2 text-sm">
                                                        <RefreshCcw size=16/>
                                                        <span class="text-base-content/70">Status:</span>
                                                        <span class="font-medium text-error ">Will not renew</span>
                                                    </div>
                                                    
                                                    
                                                {/if}
                                                        {#if subscription.status == 'past_due'}
                                                    <div class="flex items-center gap-2 text-sm">
                                                        <RefreshCcw size=16/>
                                                        <span class="text-base-content/70">Status:</span>
                                                        <span class="font-medium text-warning">No funds on your payment method, will cancel on {oneWeekBefore(subscription.current_period_end)}</span>
                                                    </div>
                                                    
                                                    
                                                {/if}
                                                     {#if subscription.status == 'active'}
                                                    <div class="flex items-center gap-2 text-sm">
                                                        <RefreshCcw size=16/>
                                                        <span class="text-base-content/70">Status:</span>
                                                        <span class="font-medium text-success ">Renews {formatDate(subscription.current_period_end)}</span>
                                                    </div>
                                                    
                                                    
                                                {/if}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Actions -->
                                    <div class="flex flex-col sm:flex-row gap-2 lg:flex-col">
                   
                                        {#if subscription.status === 'active' || subscription.status === "past_due"}
                                        <div class="flex gap-2">    
                                        <button 
                                                class="btn btn-sm btn-neutral"
                                            
                                            >
                                                     <ArrowDownUp size=16 class="mr-1.5"/>
                                                Change Plan
                                            </button>
                 <CancelPlan {subscription}/>
                                             
                                          
</div>
                                        {/if}
                                        
                                     
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
                    <a target="_blank" rel=noreferrer href="/signup/subscribe/premium" class="btn btn-primary mt-5 btn-ms"><PlusIcon/>New Subscription</a>
        {/if}

        <!-- Refresh Button -->
        {#if !loading}
            <div class="flex justify-center mt-8">
                <button 
                    class="btn btn-outline btn-wide"
                    on:click={getSubscriptions}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh Subscriptions
                </button>
            </div>
        {/if}

    </div>
</div>