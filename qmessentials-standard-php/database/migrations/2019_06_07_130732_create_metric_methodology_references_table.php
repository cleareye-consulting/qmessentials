<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMetricMethodologyReferencesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('metric_methodology_references', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('metric_id');
            $table->foreign('metric_id')->references('id')->on('metrics');
            $table->string('methodology_reference', 100);
            $table->int('sort_order');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('metric_methodology_references');
    }
}
